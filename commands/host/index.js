const express = require('express');
const app = module.exports = express()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const path = require('path')
const markdown = require('showdown').setOption('simplifiedAutoLink', true).setOption('strikethrough', true).setOption('tables', true).setOption('tasklists', true).setOption('simpleLineBreaks', true).setOption('openLinksInNewWindow', true).setOption('emoji', true);
const fs = require('fs');
const JSON = require('JSON');
const archiver = require('archiver');
const mv = require('mv');
const extract = require('extract-zip')
const formidable = require('formidable');
var files = {"media": [], "websites": []}
const converter = new markdown.Converter()
const types = JSON.parse(fs.readFileSync(`${__dirname}/types.json`, 'utf8'))
const uploadsDir = __dirname + '/media'
var isGlobalFile;

fs.readdir(uploadsDir, function(err, files) {
  files.forEach(function(file, index) {
    fs.stat(path.join(uploadsDir, file), function(err, stat) {
      var endTime, now;
      if (err) {
        return console.error(err);
      }
      now = new Date().getTime();
      endTime = new Date(stat.ctime).getTime() + 1209600000;
      if (now > endTime && !(file.contains("__keep"))) {
        return rimraf(path.join(uploadsDir, file), function(err) {
          if (err) {
            return console.error(err);
          }
        });
      }
    });
  });
});

const walkSync = (dir, filelist = []) => {
  var files = fs.readdirSync(dir);
  for (let file of files) {
    if (dir.indexOf("__hidden") !== -1) return; //Now for example if I create a folder called ThisIsInvisibleAndWillBeKept__hidden__keep, it will not be seen by this loop and will not be deleted after 14 days
    var dirFile = path.join(dir, file);
    var dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      var odir = {
        currentPath: dirFile,
        files: []
      }
      odir.files = walkSync(dirFile, dir.files);
      filelist.push(odir);
    } else {
      filelist.push({
        currentPath: dirFile
      });
    }
  }
  return filelist;
};

app.use(fileUpload({
  createParentPath: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/articles', express.static(path.join(__dirname, 'articles')))
app.use('/media', express.static(path.join(__dirname, 'media')))

app.get('/fileHost/view', function(req,res) {
  files["articles"] = walkSync(__dirname + '\\articles');
  files["media"] = walkSync(__dirname + '\\media');
  res.json(files)
})

app.post('/blogHost', function(req, res) {
  const article = req.body.article;
  const title = req.body.title;
  fs.writeFile(`./commands/blog/articles/${title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s/g, "_")}.html`, converter.makeHtml(article.replace("\n", "<br>")), function(err) {console.log(err)})
})

app.post('/mediaUpload', async (req, res) => {
  if (Object.keys(req.files).length == 0) return res.status(400).send('No files were uploaded.');

  const file = req.files.file_for_upload;
  const options = req.body.options;
  //TODO: Encrypt the hidden files with password, add download directory path, packs everything in compressed file and sends it, make notes/resource directory (with own file format?), automated webscraper to download stuff from html

  const type = (typeof req.body.extension === "undefined") ? file.mimetype : (types.hasOwnProperty(req.body.extension)) ? types[req.body.extension] : req.body.extension //<= types.json to get the same output
  if (!fs.existsSync(`${__dirname}\\media\\${(type.indexOf("/") !== -1) ? type.replace('/', '\\') : type}`)) fs.mkdirSync(`${__dirname}\\media\\${(type.indexOf("/") !== -1) ? type.replace('/', '\\') : type}`, {recursive: true}, (err) => {if (err) console.log(err)})
  file.mv(`${__dirname}\\media\\${type}\\${file.name.replace(/[,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s/g, "_")}`).then(() => {
    try {
      res.json({
        status: true,
        data: {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size,
          path: `/media/${type}/${file.name.replace(/[,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s/g, "_")}`
        }
      });
    } catch (err) {
      res.json({
        succes: false,
        error: err
      })
    }
  })
})

app.post('/bulkFileEdit', function(req, res) {
  if (req.body.action === "download") {
    const directory = path.join(path.dirname(require.main.filename) + req.body.directory).toString().replace(/\\/g, "/");
    console.log(directory)
    const outputArchive = fs.createWriteStream(__dirname + '/output.zip');
    const archiveType = (typeof req.body.archiveType === "undefined") ? "zip" : (req.body.archiveType.toLowerCase() === "tar") ? "tar" : "zip"
    var archive = archiver(archiveType, {
      zlib: { level: 9 }
    });

    isGlobalFile = /^(\/+\w{0,}){0,}\*\.\w{1,}$/g.test(req.body.directory.replace(/[,#!$%\^&;:{}=\-_`~() ]/g, ""));
    console.log(isGlobalFile);
    (isGlobalFile) ? archive.glob(directory) : archive.directory(directory, false)
    archive.pipe(outputArchive)
    archive.finalize();

    outputArchive.on('close', function() {
      res.download(__dirname + '/output.zip')
    });
  } else if (req.body.action === "delete") {
    const directory = path.join(path.dirname(require.main.filename) + req.body.directory).toString().replace(/\\/g, "/");

    isGlobalFile = /^(\/+\w{0,}){0,}\*\.\w{1,}$/g.test(req.body.directory.replace(/[,#!$%\^&;:{}=\-_`~() ]/g, ""));
    (isGlobalFile) ? archive.glob(directory) : fs.unlink(directory)
    if (isGlobalFile) {
      const dirCont = fs.readdirSync(directory);
      const files = dirCont.filter((elm) => new RegExp(`/.*\.(${directory.split("*")[1]})/`, "gi").test(elm));
      for (var i = 0; i < files.length; i++) {
        fs.unlink(files[i])
      }
    } else {
      fs.unlink(directory)
    }
  } else if (req.body.action === "upload") {
    const uploadDir = __dirname + "/media/queue/"
    const extractDir = __dirname + "/media/"
    const form = new formidable.IncomingForm();
    // file size limit 100MB. change according to your needs
    form.maxFileSize = 100 * 1024 * 1024;
    form.keepExtensions = true;
    form.multiples = true;
    form.uploadDir = uploadDir;

    form.parse(req, (err, fields, files) => {
      if (err) return res.json({ success: false, error: err });

      if (Object.keys(files).length === 0) return res.json({ success: false, error: "No files uploaded" });

      const filesInfo = Object.keys(files).map((key) => {
        const file = files[key];
        const filePath = file.path;
        const fileExt = path.extname(file.name);
        const fileName = path.basename(file.name, fileExt);
        const destDir = path.join(extractDir, fileName);

        return { filePath, fileExt, destDir };
      });

      const validFiles = filesInfo.every(({ fileExt }) => fileExt === '.zip');
      if (!validFiles) return res.json({ success: false, error: "unsupported file type" });
      res.json({
        status: true,
        data: {
          name: fileName,
          size: file.size,
          path: `/media/${type}/${file.name.replace(/[,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s/g, "_")}`
        }
      })

      // iterate through each file path and extract them
      filesInfo.forEach(({filePath, destDir}) => {
        // create directory with timestamp to prevent overwrite same directory names
        extract(filePath, { dir: `${destDir}_${new Date().getTime()}` }, (err) => {
          if (err) console.error('extraction failed.');
        });
      });
    });

    // runs when new file detected in upload stream
    form.on('fileBegin', function (name, file) {
      const fileName = path.basename(file.name, path.extname(file.name));
      const fileExt = path.extname(file.name);
      file.path = path.join(uploadDir, `${fileName}_${new Date().getTime()}${fileExt}`);
    });
  }
})
