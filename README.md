# GE-Database

GE-Database is a program that I wrote for my work to help with effeciency.

# Dependencies

Your going to need these dependencies

* [Nodejs](https://nodejs.org/)
* [Redis](https://redis.com)

# Installation

## Step 1

First Get Reverb and Square Access Tokens

* [Reverb Token](https://www.reverb-api.com/docs/authentication)
* [Square Token](https://developer.squareup.com/docs/build-basics/access-tokens#get-a-personal-access-token)

Then, create a `.env` file With the Ffollowing content

```
SQUARE_ACCESS_TOKEN=<Square Token>

REVERB_ACCESS_TOKEN=<Reverb Token>
```

## Step 2

Then, clone the repo

```
git clone https://github.com/DevGamer9991/GE-Database.git
```

## Step 3

Then, install deps

```
npm install
```

## Step 4

Then, your going to need to edit the `database-front-end/src/context/SocketContext.js` file with the ip or hostname of your server.

## Step 5

Then, build the frontend

```
npm run build
```

## Step 6

Finally, Run the server

```
npm run start
```

# Links

React Table Link:
```
https://codesandbox.io/s/react-form-with-react-table-qjwmf?from-embed=&file=/src/index.js:0-6876
```

Data Grid Docs:
```
https://mui.com/x/react-data-grid/row-updates/
```

# Square Dashboard Links:

### Dashboard:
```
https://squareup.com/dashboard/items/library
```

### Sandbox Dashboard:
```
https://squareupsandbox.com/dashboard/
```

### Node SDK Docs
```
https://developer.squareup.com/docs/sdks/nodejs
```

### Developer Console
```
https://developer.squareup.com/
```

# Reverb API Commands

### Get Listing By SKU
```
curl -k -XGET -H "Content-Type: application/hal+json" -H "Accept: application/hal+json" -H "Accept-Version: 3.0" -H "Authorization: Bearer [personal_token]" "https://api.reverb.com/api/my/listings?sku=[sku]&state=all"
```
