Static content package for `/tadabbur/`.

The 12 `corpus-*.b64` files are ordered chunks of one gzip-compressed Base64 JSON corpus. Concatenate chunks 1–12, Base64-decode, gunzip, then parse JSON.

Expected counts: H01=33, H02=38, H03=37, H04=77, H05=55, H06=85; total=325.
