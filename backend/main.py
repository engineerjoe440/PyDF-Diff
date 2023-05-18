################################################################################
"""
PyDF-Diff - A Python-Hosted Web PDF Diff Tool.

License: MIT
Author:  Joe Stanley
"""
################################################################################

from typing import Any, Annotated

from fastapi import FastAPI
from uuid import uuid4
from fastapi import FastAPI, Request, File, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
# pylint: disable=no-name-in-module
from pydantic import BaseModel, EmailStr
# pylint: enable=no-name-in-module

from differ import threaded_diff


app = FastAPI()

TEMPLATES = None


class PdfDiff(BaseModel):
    """The API Model for Requesting a Diff Between Two PDF Files."""
    file_1: bytes
    file_2: bytes
    send_to_email_address: EmailStr
    top_margin: float = 0 # TODO Set Default
    bottom_margin: float = 0 # TODO Set Default
    style: Any = None # TODO Redefine Type and Set Default
    width: float = 0 # TODO Set Default

class ResponseModel(BaseModel):
    """The API Response Model."""
    success: bool
    message: str


@app.on_event("startup")
async def startup_event():
    """Event that Only Runs When App is Starting"""
    global TEMPLATES
    # Mount the Static File Path
    app.mount("/static", StaticFiles(directory="static"), name="static")
    TEMPLATES = Jinja2Templates(directory="templates")


###############################     App Index     ##############################
@app.get("/", response_class=HTMLResponse, include_in_schema=False,)
@app.get("/index", response_class=HTMLResponse, include_in_schema=False,)
@app.get("/index.htm", response_class=HTMLResponse, include_in_schema=False,)
@app.get("/index.html", response_class=HTMLResponse, include_in_schema=False,)
async def index(request: Request):
    """Web Entrypoint."""
    return TEMPLATES.TemplateResponse(
        "index.html",
        {
            "request": request,
            "fastapi_token": uuid4(),
        },
    )

################################################################################

@app.post("/api/v1/generate-diff")
def generate_diff(options: PdfDiff) -> dict[str, str]:
    """Generate the Difference Between two Files."""
    path = threaded_diff(
        file_1=options.file_1,
        file_2=options.file_2,
        top_margin=options.top_margin,
        bottom_margin=options.bottom_margin,
        style=options.style,
        width=options.width,
    )
    return

# END
