<h1 align="center">
  next-static-manifest
</h1>

<p align="center">
Create a static page manifest of your 
<a href="https://nextjs.org/docs/advanced-features/static-html-export">Next.js exported html pages</a>, allowing you to match incoming requests with dynamic Next.js HTML routes.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/next-static-manifest">
    <img src="https://img.shields.io/npm/dy/next-static-manifest.svg">
  </a>
  <a href="https://www.npmjs.com/package/next-static-manifest">
    <img src="https://img.shields.io/npm/v/next-static-manifest.svg?maxAge=3600&label=next-static-manifest&colorB=007ec6">
  </a>
  <img src="https://img.shields.io/github/repo-size/hanford/next-static-manifest.svg" />
</p>

<br/>

## Installation

```sh
$ npm install --save next-static-manifest
```

```sh
$ yarn add next-static-manifest
```

## Usage

Let's take a look at this scenario, our application looks like this:

```
|-- pages
|   |-- index.js
|   |-- [...slug].js
|   |-- blog/posts/[id].js
|   |-- blog/posts/[id]/[authorId].js
```

We add next-static-manifest to our export script:

```sh
$ next build && next export && next-static-manifest
```

And after exporting our app, we get this:

```
|-- out
|   |-- next-static-manifest.json
|   |-- index.html
|   |-- [...slug].html
|   |-- blog/posts/[id].html
|   |-- blog/posts/[id]/[authorId].html
```

The `next-static-manifest.json` will look this:

```json
[
  {
    "src": "/blog/posts/[id]/[authorId]",
    "dest": "/blog/posts/[id]/[authorId].html",
    "regex": "__REGEXP__:/^\\/blog\\/posts\\/([^/]+?)\\/([^/]+?)(?:\\/)?$/",
    "dynamic": true
  },
  {
    "src": "/blog/posts/[id]",
    "dest": "/blog/posts/[id].html",
    "regex": "__REGEXP__:/^\\/blog\\/posts\\/([^/]+?)(?:\\/)?$/",
    "dynamic": true
  },
  {
    "src": "/index",
    "dest": "/index.html",
    "regex": "__REGEXP__:/^\\/index(?:\\/)?$/",
    "dynamic": false
  },
  {
    "src": "/404",
    "dest": "/404.html",
    "regex": "__REGEXP__:/^\\/404(?:\\/)?$/",
    "dynamic": false
  },
  {
    "dynamic": false,
    "regex": "__REGEXP__:/^\\/(?:\\/)?$/",
    "src": "/",
    "dest": "index.html"
  },
  {
    "src": "/[...slug]",
    "dest": "/[...slug].html",
    "regex": "__REGEXP__:/^\\/(.+?)(?:\\/)?$/",
    "dynamic": true
  }
]
```

Without any type of infrastructure in place, we can't route users to our dynamically exported routes.

A request to: `/blog/posts/123-456-789` wont match our filesystem location for the `/blog/posts/[id].html` file.

However, if we write a small [Lambda@Edge](https://aws.amazon.com/lambda/edge/#:~:text=Lambda%40Edge%20is%20a%20feature,improves%20performance%20and%20reduces%20latency.&text=With%20Lambda%40Edge%2C%20you%20can,all%20with%20zero%20server%20administration.) function or use a [Worker](https://workers.cloudflare.com/) to ingest this file, we can automatically route users to the correct `.html` entrypoint.

## How it works

`next-static-manifest` runs after your app has been exported by Next. We generate a `next-static-manifest.json` file that you can poll on Lambda@Edge or in your Worker, after deploying, your worker will get a new file and route accordingly.

In your function/worker, it's important to use `decode` when parsing the manifest file.

```js
import { decode } from 'next-static-manifest';

fetch('.../next-static-manifest.json')
  .then(r => r.json())
  .then(data => decode(data));
```

We need to hydrate our data with `decode`, because regex isn't part of the JSON spec, so we have to encode/decode it ourselves.

<hr />

Questions? Feedback? [Please let me know](https://github.com/hanford/next-static-manifest/issues/new)

## License (MIT)

```
WWWWWW||WWWWWW
 W W W||W W W
      ||
    ( OO )__________
     /  |           \
    /o o|    MIT     \
    \___/||_||__||_|| *
         || ||  || ||
        _||_|| _||_||
       (__|__|(__|__|
```

Copyright © 2020-present [Jack Hanford](http://jackhanford.com), jackhanford@gmail.com
