# lc-auto-withdrawal
Lending Club auto withdrawal script.

Useful for withdrawing your available balance frequently to wind down your account. Intended to be setup with a cronjob or Heroku's scheduler.

### Usage:

```
git clone https://github.com/effinggames/lc-auto-withdrawal.git && cd lc-auto-withdrawal
(setup env variables)
npm start
```

Env variables required:  
`LENDING_CLUB_EMAIL`: Lending Club Email  
`LENDING_CLUB_PASSWORD`: Lending Club Password  

