# Bit.dev Inferring typescript issue

## Reproduce steps

```shell
# init bit workspace
bit init

# import published bit packages and extensions
bit import

# install deps + link packages as post-install 
yarn

# tag all untagged or updated packages
bit tag --all
```