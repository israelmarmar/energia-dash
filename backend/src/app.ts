import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import config from "./config";
import multer from "multer";
import path from "path";
import fs from "fs";
// @ts-ignore
import pdf from "pdf-extraction";
import { PrismaClient } from "@prisma/client";
import extractData from "./utils/extractData";
import cors from 'cors';

const prisma = new PrismaClient();

const app = express();
app.use(cors())
app.use(logger(config.loggerLevel));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

function render_page(pageData: any) {
  //check documents https://mozilla.github.io/pdf.js/
  let render_options = {
    //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: false,
    //do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false,
  };

  return pageData
    .getTextContent(render_options)
    .then(function (textContent: any) {
      let lastY,
        text = "";
      for (let item of textContent.items) {
        if (lastY == item.transform[5] || !lastY) {
          text += item.str;
        } else {
          text += "\n" + item.str;
        }
        lastY = item.transform[5];
      }
      return text;
    });
}

let options = {
  pagerender: render_page,
};

app.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      let dataBuffer = fs.readFileSync(req.file?.path || "");
      const data = await pdf(dataBuffer, options);

      const createRow = await prisma.energyData.create({
        data: { ...extractData(data.text), pathFile: req.file?.path },
      });
    
      res.send({
        ...createRow,
      });
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: "File upload failed",
        error: (error as Error).message,
      });
    }
  }
);

app.get("/bills", async (req: Request, res: Response) => {
  console.log(req.query)
  try {
    const bills = await prisma.energyData.findMany({where: { nClient: req.query?.q as string, }, orderBy: {    
      date: 'asc'
  }});
    console.log(bills)
    res.send(
      bills,
    );
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "failed",
      error: (error as Error).message,
    });
  }
});

app.get('/download/:path', function(req, res){
  const file = `${__dirname}/../uploads/${req.params.path}`;
  console.log(file)
  res.download(file); // Set disposition and send it.
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
