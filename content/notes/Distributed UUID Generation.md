---
stage: Seedling
tags: system-design
---
3 approachs:
# Global Counter
Generate a batch of ID(such as 1000)
Using INCR of Redis
Pros:
Fast, expensive
Cons:
Loose id batch when server go down

Using ETCD
Pros:
Consensus algo: Paxos
Could not go down
# Snowflake UUID
Generate a UUID with 64bit
1bit always 0
41bit current timestamp
5bit data center id
5bit machine id
12bit sequence number(incremental number) 4096 id in each miliseconds