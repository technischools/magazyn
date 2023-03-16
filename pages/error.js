module.exports = function (err, req, res, next) {
    // set locals, only providing error in development
    const locals = {
        error: req.app.get("env") === "development" ? err : {},
        notFound: err.status == 404,
        viewNotFound: err.name == 'ViewNotFound',
        connectionError: err.name == 'ConnectionError'
    }
  
    // render the error page
    res.status(err.status || 500);
    res.render(`error`, locals);
  }