---
stage: Seedling
tags:
  - system-design
---
# Requirement
## Functional
Starting raw from seed URL
## Non functional
Scale to 1B pages.
Robustness. Fault tolerance
Politeness

# High Level Design
![[SD-WC3.svg]]
1. Crawler get URL from Frontier
2. Check exists in DNS Cache, if exists it download HTML page, if not it move to DNS Resolver to get IP, then download HTML page.
3. After download HTML it hash HTML then check is existed in URL metadata, if exists do nothing, if not exists, it store HTML to Storage, and store URL metadata. then push an message to Parsing Queue with id of url metadata
4. Parsing Service consume message from Parsing Queue, then query URL metadata to get storageLink
5. After have HTML Storage Link it download HTML Storage then parsing to extract data then store data to Data Storage extract child URL and check exists in URL metadata if not exists and put URL back to Frontier, if exists do not push back
# Deep Dive
## BFS or DFS
BFS better than DFS due to could URL can very deep.
## URL Frontier
### Politeness
Avoid to affect workload of server.
Download 1 page/1 host at a time.
![[SD-WC2.svg]]
Data in Mapping Table:

| Host     | Queue |
| -------- | ----- |
| wiki.com | Q1    |
| apple.co | Q2    |
Flow
URL come to Queue Router, it check in mapping table to get info of Queue.
Queue Router push URL to Queue.
Queue Selector follow list of Queue to see new URL.
When new URL come to Queue, Queue Selector pick URL and assign to READY worker to handle that URL. then Queue Selector mark the Queue are PROCESSING.
When Worker complete to handle URL, it inform Queue Selector to add DELAY to specific Q.
## HTML Downloader
Check robots.txt
Cache DNS Resolver
Adding timeout

Put Bloom FIlter at step 5
