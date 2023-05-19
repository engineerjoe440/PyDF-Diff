################################################################################
"""
PyDF-Diff - A Python-Hosted Web PDF Diff Tool.

License: MIT
Author:  Joe Stanley
"""
################################################################################

from typing import Annotated
from enum import Enum
from tempfile import TemporaryDirectory
from pathlib import Path

from fastapi import FastAPI
from uuid import uuid4, UUID
from fastapi import FastAPI, Request, File, UploadFile, HTTPException, status
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
# pylint: disable=no-name-in-module
from pydantic import BaseModel, EmailStr
# pylint: enable=no-name-in-module

import differ

app = FastAPI()

class DiffStyle(str, Enum):
    """Style of Diff to Perform."""
    box = "box"
    strike = "strike"
    stroke = "stroke"
    underline = "underline"

DEFAULT_STYLES = [DiffStyle.strike, DiffStyle.underline]

class ResponseModel(BaseModel):
    """The API Response Model."""
    success: bool
    message: str


class Server:
    """Server Management Object."""
    tempdir: TemporaryDirectory
    templates: Jinja2Templates

SERVER = Server()

@app.on_event("startup")
async def startup_event():
    """Event that Only Runs When App is Starting"""
    # Mount the Static File Path
    app.mount("/static", StaticFiles(directory="static"), name="static")
    SERVER.templates = Jinja2Templates(directory="templates")
    SERVER.tempdir = TemporaryDirectory("pydf_diff")

@app.on_event("shutdown")
async def shutdown_event():
    """Event that Only Runs When App is Shutting Down."""
    SERVER.tempdir.cleanup()


###############################     App Index     ##############################
@app.get("/", response_class=HTMLResponse, include_in_schema=False,)
@app.get("/index", response_class=HTMLResponse, include_in_schema=False,)
@app.get("/index.htm", response_class=HTMLResponse, include_in_schema=False,)
@app.get("/index.html", response_class=HTMLResponse, include_in_schema=False,)
async def index(request: Request):
    """Web Entrypoint."""
    return SERVER.templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "client_id_token": uuid4(),
        },
    )

@app.get("/download/PyDF-DIFF.png", response_class=FileResponse)
async def download_file(client: UUID):
    """Respond with the Download File."""
    return FileResponse(
        path=Path(SERVER.tempdir.name) / f"{client}.png",
        filename="PyDF-DIFF.png",
        media_type="image/png",
    )

################################################################################

@app.post("/api/v1/generate-diff")
async def generate_diff(
    files: Annotated[
        list[UploadFile], File(description="Two PDFs for comparison")
    ],
    client_id: UUID,
    send_to_email_address: EmailStr,
    top_margin: float = 0,
    bottom_margin: float = 100,
    width: int = 900,
    style: list[DiffStyle] = DEFAULT_STYLES,
) -> ResponseModel:
    """Generate the Difference Between two Files."""
    if len(files) != 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Requires exactly two discrete PDF files; {len(files)} "
                "provided."
            )
        )
    # Store Files in Temporary Directory
    temp_dir_path = Path(SERVER.tempdir.name)
    local_paths = []
    for file in files:
        file_path = temp_dir_path / file.filename
        with open(file_path, 'wb') as temp_file_writer:
            # Write File Contents from Spooled File
            temp_file_writer.write(await file.read())
        local_paths.append(file_path)
    try:
        differ.generate_diff(
            file_1=local_paths[0],
            file_2=local_paths[1],
            unique_id=client_id,
            top_margin=top_margin,
            bottom_margin=bottom_margin,
            width=width,
            style=style,
        )
    except Exception as ex:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=ResponseModel(success=False, message=str(ex)).dict()
        )
    return ResponseModel(
        success=True,
        message="Done."
    )

# END
