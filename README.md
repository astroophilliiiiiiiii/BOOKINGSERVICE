## 🛠️ Steps to Create a New Project Using TS-Template

1. Clone the project -- copt paste all lines all-together

```
git clone https://github.com/astroophilliiiiiiiii/Typescript-Template.git temp
rm -rf temp/.git
cp -a temp/. .
rm -rf temp
```

2. Remove the TS-TEMPLATE --MOVING IN BASE FOLDER

```
cp -a TS-TEMPLATE/. .
rm -rf TS-TEMPLATE
```
3. Install the npm dependencies 

```
npm i 
```

4. Create a new .env file in the root directory and add the PORT and MONGO_URI variables

``` 
echo -e "PORT=8085\nMONGO_URI=your_mongodb_connection_string_here" >> .env
```

5. Start the express Server 

```
npm run dev
```
