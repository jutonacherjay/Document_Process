from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import os
from process_files import process_files

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-files")
async def process_files_endpoint(csvFile: UploadFile = File(...), excelFile: UploadFile = File(...)):
    try:
        csv_path = f"temp_{csvFile.filename}"
        excel_path = f"temp_{excelFile.filename}"

        # Save uploaded files temporarily
        with open(csv_path, "wb") as csv_buffer:
            shutil.copyfileobj(csvFile.file, csv_buffer)
        with open(excel_path, "wb") as excel_buffer:
            shutil.copyfileobj(excelFile.file, excel_buffer)

        # Process files
        processed_csv_path, processed_excel_path = process_files(csv_path, excel_path)

        # Cleanup temp files
        os.remove(csv_path)
        os.remove(excel_path)

        return {
            "processedCSV": processed_csv_path,
            "processedExcel": processed_excel_path,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing files: {e}")

@app.get("/download-file/{filename}")
async def download_file(filename: str):
    try:
        file_path = filename
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        return FileResponse(
            file_path,
            media_type="application/octet-stream",
            filename=filename,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading file: {e}")
