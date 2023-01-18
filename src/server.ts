import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import mime from 'mime-types';
(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const image_url: string  = req.query.image_url.toString();
    // console.log(req.query.image_url.toString(), "----")
    if (!image_url) {
      return res.status (400). send (' image_uri is required!' );
    }
    const mimeType = mime.lookup(image_url);
    if (mimeType === 'image/jpeg' || mimeType === 'image/png') {
       const filteredImage = await filterImageFromURL(image_url);
       if(!filteredImage){
         return res.status(404).send("Image not found");
       }
      res.status(200).sendFile(filteredImage, { type: mimeType }, () => {
          deleteLocalFiles([filteredImage])
      });
    }
    else {
        res.status(415).send(`Invalid image type: ${mimeType}. Only jpeg and png images are allowed.`);
    }

   
  });
  

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();