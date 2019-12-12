package persistence

import (
	"github.com/CodFrm/cxmooc-tools/server/domain/entity"
	"github.com/CodFrm/cxmooc-tools/server/domain/repository"
	goRedis "github.com/go-redis/redis/v7"
	"strconv"
	"time"
)

type integral struct {
}

func NewIntegralRepository() *integral {
	return &integral{}
}

func (i *integral) GetIntegral(token string) (*entity.IntegralEntity, error) {
	cmd := redis.Get("cxmooc:vtoken:" + token)
	if err := cmd.Err(); err != nil {
		return nil, err
	}
	val := cmd.Val()
	num, err := strconv.Atoi(val)
	if err != nil {
		return nil, goRedis.Nil
	}
	return &entity.IntegralEntity{
		Token: token,
		Num:   num,
	}, nil
}

func (i *integral) Update(integral *entity.IntegralEntity) error {
	return redis.Set("cxmooc:vtoken:"+integral.Token, integral.Num, 0).Err()
}

func (i *integral) Create(integral *entity.IntegralEntity) error {
	return redis.Set("cxmooc:vtoken:"+integral.Token, integral.Num, 0).Err()
}

func (i *integral) Transaction() repository.IntegerTransactionRepository {
	return &integralTransaction{repo: i}
}

type integralTransaction struct {
	repo   *integral
	token  string
	commit bool
	oldNum *entity.IntegralEntity
}

func (i *integralTransaction) Rollback() error {
	if err := i.unlock("cxmooc:lock:" + i.token); err != nil {
		return err
	}
	i.commit = true
	if i.oldNum != nil {
		return i.repo.Update(i.oldNum)
	}
	return nil
}

func (i *integralTransaction) Close() error {
	if i.commit {
		return nil
	}
	return i.Rollback()
}

func (i *integralTransaction) Commit() error {
	if err := i.unlock("cxmooc:lock:" + i.token); err != nil {
		return err
	}
	i.commit = true
	return nil
}

func (i *integralTransaction) LockIntegral(token string) (*entity.IntegralEntity, error) {
	// 使用分布式锁,确保一致性
	if err := i.lock("cxmooc:lock:" + token); err != nil {
		return nil, err
	}
	i.token = token
	ret, err := i.repo.GetIntegral(token)
	if err != nil {
		i.oldNum = ret
	}
	return ret, err
}

func (i *integralTransaction) Update(integral *entity.IntegralEntity) error {
	return i.repo.Update(integral)
}

func (i *integralTransaction) lock(key string) error {
	// 使用分布式锁,确保一致性
	for {
		cmd := redis.SetNX(key, 1, time.Second*10)
		if err := cmd.Err(); err != nil {
			return err
		}
		if cmd.Val() {
			break
		}
		time.Sleep(time.Second)
	}
	return nil
}

func (i *integralTransaction) unlock(key string) error {
	return redis.Del(key).Err()
}
