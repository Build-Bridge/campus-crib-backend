 import bodyParser from "body-parser";
 
     bodyParser.json({limit:"50mb", extended: true})
     bodyParser.urlencoded({limit:"50mb", extended: false})
 
     export default bodyParser;
   