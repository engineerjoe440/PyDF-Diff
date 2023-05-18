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

from pdf_diff.command_line import compute_changes, render_changes

def generate_diff(
    file_1: str,
    file_2: str,
    top_margin: float,
    bottom_margin: float,
    style,
    width,
    *_,
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
    return img

def threaded_diff(*args, **kwargs):
    """Threaded Difference Generator."""
    thread = Thread(target=generate_diff, args=args, kwargs=kwargs, daemon=True)
    thread.start()
    return thread.join()

# END
