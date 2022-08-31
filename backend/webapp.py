################################################################################
"""
PyDF-Diff - A Python-Hosted Web PDF Diff Tool.

License: MIT
Author:  Joe Stanley
"""
################################################################################

from fastapi import FastAPI
from uuid import uuid4
from fastapi import FastAPI, Request, File, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel



app = FastAPI()

TEMPLATES = None


class PdfDiff(BaseModel):
    """The API Model for Requesting a Diff Between Two PDF Files."""
    file_1: UploadFile
    file_2: UploadFile


@app.on_event("startup")
async def startup_event():
    """Event that Only Runs When App is Starting"""
    global TEMPLATES
    # Mount the Static File Path
    app.mount("/static", StaticFiles(directory="static"), name="static")
    TEMPLATES = Jinja2Templates(directory="templates")


###############################     App Index     ##############################
@app.get("/", response_class=HTMLResponse)
@app.get("/index", response_class=HTMLResponse)
@app.get("/index.htm", response_class=HTMLResponse)
@app.get("/index.html", response_class=HTMLResponse)
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
def generate_diff(diff_config: PdfDiff):
    """Generate the Difference Between two Files."""
    return

# END
