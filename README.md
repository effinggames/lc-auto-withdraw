# lc-auto-withdrawal
Lending Club auto withdrawal script using selenium + chrome.   

Useful for withdrawing your available balance frequently to wind down your account.   

Intended to be setup with on a cronjob.   

### Usage:

```
git clone https://github.com/effinggames/lc-auto-withdrawal.git && cd lc-auto-withdrawal
npm install
(setup env variables)
npm start
```

Env variables required:  
`LENDING_CLUB_EMAIL`: Lending Club Email  
`LENDING_CLUB_PASSWORD`: Lending Club Password  

