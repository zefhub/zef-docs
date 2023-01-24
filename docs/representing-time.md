---
id: representing-time
title: Representing Time
---

  
### Absolute Time  
```python  
my_time = Time('2020-01-01 12:00:00 +08:00')    # absolute time.  
```  
  
- constructible from different representations  
- internal data does **not** contain the time zone  
- equality: two times are equal if they denote the same point in time. Time zone does not play a role.  
- comparison is also supported  
  
  
### Civil Time  
```python  
my_cicil_time = CivilTime('2020-01-01 12:00:00 +08:00')  
```  
- Data representation of both point in time **and** time zone (e.g. as is common in Python's datetime)  
- two CivilTimes compare equal if both the point in time **and** the time zones compare equal  
  
  
###  CivilDate  
```python  
my_date = CivilDate('2020-03-27')  
```  
- not opinionated about time zone: time zone not saved  
- not equivalent to specifying an absolute time / interval: it is up to the interpretation of the consumer which points in time time / interval this corresponds to  
- potentially useful for storing "sloppy" information like "date of birth" etc.  
  
  
  
### References & Material  
- Zef's shares the (probably minority) stance on representing time as Google's Abseil library does: https://abseil.io/docs/cpp/guides/time  
- This is also discussed in the [talk by Greg Miller](https://www.youtube.com/watch?v=2rnIHsqABfM)  
