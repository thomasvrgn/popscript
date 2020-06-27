
# 🍿 Popscript programming language

Popscript is a programming language focused on simplicity, productivity and speed.

## 📦 Install it

You'll need:

- Node.js > 13
- NPM > 6

```bash

   # Open terminal and type:

   ~ npm i

   # Once package are installed, type:

   ~ npm run dev

   # It will execute simple example code.

```

## 💬 Simple hello world script

```py

   print "Hello world!"

```

## 🔨 How it works

Popscript is a tab-based language. Its particularity is that it does not require a keyboard combo like CTRL + ALT.

#### • Variables

##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Strings
```py

   username = "Ness"
   print "Welcome" username + "!"

```
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Numbers
```py

   number = 10
   print "Number is" number

```
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Arrays
```py

   array = ( "item" "item" "item" )
   print "Array is" array

```
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Booleans
```py

   boolean = true
   print "Switched:" boolean
   
```
#### • Remove values
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Strings
```py

   text = "My name is Ness"
   print text - "Ness" ; Output : "My name is "

```
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Numbers
```py

   number = 5
   print number - 2 ; Output : 3

```
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Arrays
```py

   array = ( "item" "item2" "item3" )
   print array - "item" ; Output : ["item2", "item3"]

```
#### • Add values
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Strings
```py

   text = "My name is Ness"
   text += "."
   print text ; Output : "My name is Ness."

```
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Numbers
```py

   number = 5
   number += 5
   print number ; Output : 10

```
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Arrays
```py

   array = ( "item" "item2" "item3" )
   array += "item4"
   print array ; Output : ["item", "item1", "item2", "item3"]

```
#### • Indexes
```py
   array = ( "item" "item2" "item3" )
   print array:0 ; Output : "item"
```
#### • Properties
```py

   array = ( "item" "item2" "item3" )
   print array:length ; Output : 2
```
#### • Type conversion
```py

   number = 5
   print str : number
   
   number = "10"
   print int : number
   
```
#### • Comments

```clj

   ; This is a comment
   comment = "coucou" ; Comments can follow any declaration.

```

#### • Conditions

```py

   number = 5
   if number > 5
	   print "Number higher than 5"
   elif number = 5
       print "Number equal to 5"
   else
	   print "Number lower than 5"
	
```

#### • Loops
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • For loops
```py

   array = ( "item1" "item2" "item3" )
   for item in array
	   print "Item is" item

```
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • While loops
```py

   number = 0
   while number < 10
	   number += 1
	   print "Number value is" number

```

#### • Functions
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Define functions
```py

    fn welcome => user
	    print "Welcome" user + "!"

```

##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Call functions
```py

    welcome => "Ness"

```
#### • And / Then
```py

   username = "Ness" and print username
   number   = 5 and number += 5 then print number
   
```
#### • Modules
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Export
```py

   ; File is module.ps
   export fn welcome => user
	   print "Welcome" user + "!"
	
```
##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • Import
```lsp
   
   import module from "module"
   module -> welcome => "Ness" ; Output: "Welcome Ness!"
	
```