/*
CREATE TABLE PEG.JS parser

This is designed to parse CREATE TABLE's created by SQLite as it does not
provide a good way to describe a table otherwise :(
*/

statement
 = "CREATE TABLE " tableName:thingName whitespace "(" columns:columns ")" { return { name: tableName, columns: columns }; }

columns
 = whitespace column:column whitespace "," columns:columns {
   if(!columns.unshift){
     columns = [columns];
   }
   columns.unshift(column);
   return columns;
 } / whitespace column:column whitespace { return column; }

column
 = name:thingName whitespace type:type whitespace args:args {
   return {
     "type": "column",
     "name": name,
     "type": type,
     "args": args
   }
 } / value:constraint {
   return value;
 }

constraint
 = "CONSTRAINT " name:thingName whitespace details:constraint_details {
   return {
     "type": "constraint",
     "name": name,
     "details": details
   };
 }
 / "FOREIGN KEY " from:list_of_things " REFERENCES " to:otherTableThing whitespace "ON DELETE " foreignKeyThing " ON UPDATE " foreignKeyThing {
   return {
     "type": "foreignKey",
     "from": from,
     "to": to
   };
 }

foreignKeyThing
 = "NO ACTION" / "CASCADE"

constraint_details
 = "PRIMARY KEY" whitespace items:list_of_things {
   return {
     "type": "primaryKey",
     "on": items
   }
 }

type
 = "INTEGER" / "NUMERIC(" number "," number ")" / "TEXT"

number
 = value:[0-9]+ { return parseInt(value.join("")); }

args
 = "NOT NULL" /

list_of_things
 = "(" whitespace things:_list_of_things whitespace ")" {
   return things;
 }

_list_of_things
 = thingName whitespace "," whitespace _list_of_things
 / name:thingName { return [name]; }

otherTableThing
 = otherTable:thingName whitespace "(" otherColumn:thingName ")" {
   return {
     "table": otherTable,
     "column": otherColumn
   }
 }

thingName
 = "[" name:[0-9A-Za-z\_]+ "]" { return name.join(""); }

whitespace
 = [ \n\t]+ { return null; } / { return null; }
