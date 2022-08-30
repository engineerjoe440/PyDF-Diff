################################################################################
"""
PyDF-Diff - A Python-Hosted Web PDF Diff Tool.

License: MIT
Author:  Joe Stanley
"""
################################################################################

from fastapi import FastAPI


app = FastAPI()


###############################     App Index     ##############################
@app.get("/")
@app.get("/index")
@app.get("/index.htm")
@app.get("/index.html")
def index():
    """Web Entrypoint."""
    return
################################################################################

@app.post("/api/v1/generate-diff")
def generate_diff():
    """Generate the Difference Between two Files."""
    return

# END
