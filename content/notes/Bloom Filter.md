---
stage: Seedling
tags:
  - system-design
---
# What is Bloom Filter?
Bloom Filter is data structure for checking an item exists in a set.
- If BF say 'no', absolutely no exists. 100%
- If BF say 'yes', probably exists. Not sure (False positive)
Bloom Filter really small, it not store actual items, it store a bit are created by that item
it stores:
- a bit array of length `m`
- `k` hash function
Example:
Initialize an array with `m` bit all of them are 0, and k = 2 (hash 2 times H1, H2)
```
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```
To add an item:
- Hash an item with `k` times
- Get positions of bit
- Set position of array from 0 to 1
CAT
Hash first time: 1
Hash second time: 5
```
[0, 1, 0, 0, 0, 1, 0, 0, 0, 0]
```
DOG
Hash first time: 4
Hash second time: 5 (1 already exists still keep 1)
```
[0, 1, 0, 0, 1, 1, 0, 0, 0, 0]
```
To query an item:
- Hash an item with `k` times
- Get position of bit
- Check position, if 0 mean no exists, if 1 probably exists
BIRD
Hash first time: 1
Hash second time: 7
```
[0, 1, 0, 0, 1, 1, 0, 0, 0, 0]
```
Position at 1 exists.
Position at 7 no exists.
=> No exists
FOX
Hash first time: 1 
Hash second time: 4
Position at 1 exists.
Position at 4 exists.
=> Exists (False positive)
# Size of Bloom Filter
10 times of `n`
Example: 10B Urls
=> `m` = 100B bit (12.5GB)

Calculate `k`
(m/n)*0.7 = 10 * 0.7 = 7
=> k = 7




