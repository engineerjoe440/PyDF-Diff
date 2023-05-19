################################################################################
"""
PyDF-Diff - A Python-Hosted Web PDF Diff Tool.

License: MIT
Author:  Joe Stanley
--------------------------------------------------------------------------------

differ.py - the Python difference support file.
"""
################################################################################

from threading import Thread
from pathlib import Path

from pdf_diff.command_line import compute_changes, render_changes

def generate_diff(
    file_1: str,
    file_2: str,
    unique_id: str,
    top_margin: float,
    bottom_margin: float,
    width: float,
    *_,
    style: str = "strike,underline",
    **__
) -> str:
    """Generate Difference between Two PDF Files."""
    changes = compute_changes(
        file_1,
        file_2,
        top_margin=float(top_margin),
        bottom_margin=float(bottom_margin)
    )
    img = render_changes(changes, style, width)
    output_path = Path(file_1).parent / f"{unique_id}.png"
    with open(output_path, 'wb') as generated:
        img.save(generated, 'png')

def threaded_diff(*args, **kwargs):
    """Threaded Difference Generator."""
    thread = Thread(target=generate_diff, args=args, kwargs=kwargs, daemon=True)
    thread.start()
    return thread.join()

# END
