const fs = require("fs");

const path = require("path");

module.exports = function(config) {
    const {pagesDir} = config;

    return async function (req, res, next) {
        let urlPath = req.path.split("/")[1];
      
        if (req.path == "/") {
            urlPath = "index";
        }
      
        const handlerFile = path.join(pagesDir, `${urlPath}.js`);

        if (!fs.existsSync(handlerFile)) {
          return next();
        }
      
        const fn = require(handlerFile);
      
        try {
          const local = await fn(req, res, next);
      
          if (res.headersSent) {
            return;
          }

          const viewFile = path.join(pagesDir, `${urlPath}.hbs`)
      
          if (!fs.existsSync(viewFile)) {
            const err = new Error(`File ${viewFile} not found`);
            err.name = 'ViewNotFound';
      
            throw err;
          }
      
          res.render(viewFile, local);
      
        } catch (e) {
          next(e);
        }
      }
}