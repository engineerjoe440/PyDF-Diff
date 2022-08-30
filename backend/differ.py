################################################################################
"""
PyDF-Diff - A Python-Hosted Web PDF Diff Tool.

License: MIT
Author:  Joe Stanley
--------------------------------------------------------------------------------

differ.py - the Python difference support file.
"""
################################################################################

from pdf_diff.command_line import compute_changes, render_changes

def generate_diff(file_1, file_2, top_margin, bottom_margin, style, width):
    """Generate Difference between Two PDF Files."""
    changes = compute_changes(
        file_1,
        file_2,
        top_margin=float(top_margin),
        bottom_margin=float(bottom_margin)
    )
    img = render_changes(changes, style, width)
    return img

# END
