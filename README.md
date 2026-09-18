Building Docker

Optimizing the Image size, Originally we used oven/bun:latest -> Debian Based

Now we are using oven/bun:1-alpine --> Its light image

and 
bun install --prod (Install only necessary dependencies)
This reduced the image size from 603MB to 403MB

We had to install openssl which is only 5-6mb extra
