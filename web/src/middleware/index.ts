import {
    handleBodyRequestParsing,
    handleCompression
  } from "./common";
  
  import { handleAPIDocs } from "./api-docs";
  import { handleCSMUI} from "./static-ui";
  
  export default [
    handleBodyRequestParsing,
    handleCompression,
    handleAPIDocs,
    handleCSMUI
  ];