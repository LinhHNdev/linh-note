---
stage: Incubating
tags:
  - system-design
---
# Requirement
## Functional
Create a shortURL from longURL
- Custom alias
- Expiration time
Redirect to longURL from shortURL
- Count number of redirect
## Non Functional
Availability >> Consistency
Ensure unique shortURL
Clean up expired url
Low latency on redirect < 100ms
Count number of redirect doesn't affect redirection.
Scale to 1B urls and 100M DAU with ratio WR is 1:100
# API Design
1. POST /shorten
Request: longUrl, customAlias, expirationDate
Return: shortUrl
2. GET /{urls}
Request: shortUrl
Response:
Status 302 [[HTTP Status 302 vs 301]]
Header: Location: longUrl
# High Level Design
## Data model
URL
- shortURL (customAlias)
- longURL
- expirationTime
- createdBy
![[SD-URL1.svg]]
# Deep dive
## How to ensure shortURL are unique?
### Hash + Base62 Encoding
Using hash function like MD5 on longURL to generate hash value.
Encoding hash value with Base62 to get 7 characters.

Problem:
Same longURL return same shortURL different with different owner
Solution:
Adding UserId before longURL

Problem:
Easy to collision
Solution:
Put a unique constraints in DB, when DB return error retry with add random salt after longURL then retry 3-5 times.
### Base62 Encoding the UUID
Get a batch of [[Distributed UUID Generation|UUID]]
Take a key in this batch.
Encoding the UUID with Base62 Encoding to get 7 characters
### Custom alias
2 Options:
- Validate min length is 8
- Or force to adding character - or _
## How to ensure redirect are fast?
To improve redirect speed, we introduce an cache server like Redis between application and database.
The cache server store frequently used URL.
The application check shortURL in cache first, if exists return longURL, if not moving to database to get longURL.
Eviction policies: LFU.
## How to clean up expiredURL?
### Lazy Loading
Check url expired? If no return, if yes delete it then return 404
### Use TTL
In case using NoSQL, assign TTL for record, database auto remove that expired record
Cons: Relational DB doesn't support
### Use Cron job
Running Cron job when downtime and delete with small batch
## How to count number of redirect?
2 approachs:
### Using Redis INCR + Cron
Introduce Redis Counter, When redirect happens, application executes atomic increment.
Write a cron job to poll data from redis, and insert bulk to database
Tradeoff: Redis go down, lost all data
### Using MQ
Introduce an MQ service, and Analytics Service (Consumer)
Flow: Redirect push a message to MQ, MQ will batch an message, each 5m Analytics Service Consume a batch message then update database
## How to scale to support 1B URLs?
Each record:
shortURL 8byte
longURL 100byte
expiration 8byte
userId 16
Total + Other things (creation, or some metadata,....) ~ 500byte
500byte * 1B = 500Gb
500Gb is not high volume, no need to Sharding

with WR ratio 1:100 we do 2 things:
Separate URL service to: Shortening Service and Redirect Service, easy for horizontal scale. We scale Redirect Service frequently, rarely to scale Shortening Service.
Database Replication: Create a copy in multi node. Just 1 node take care write, many node are follower.
# Final Design
![[SD-URL2.svg]]