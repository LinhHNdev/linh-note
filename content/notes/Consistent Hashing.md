---
stage: Incubating
tags:
  - system-design
---
In Database Sharding, data store in many server. Using index for add and search data to database shard.
`index = hash(key) % n, n = number_of_nodes`
Example: n = 4
index = hash(key) % 4 = 1.
=> key added to shard 1, and search also use same formula go to shard 1 get data.
If server go down. now `n - 1 = 3` Now formula not working correctly, it can be occur storm of cache miss
# Consistent Hashing
