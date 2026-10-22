import pypdfium2 as pdfium
import os

pdf_path = os.path.join("public", "Rohan_Sai_Jagan_Resume.pdf")
output_path = os.path.join("public", "resume-preview.png")

if not os.path.exists(pdf_path):
    # Try alternate location
    alt_path = os.path.join("public", "assets", "aistudio", "ROHAN_SAI_JAGAN_RESUME___1__a6810999.pdf")
    if os.path.exists(alt_path):
        pdf_path = alt_path

pdf = pdfium.PdfDocument(pdf_path)
page = pdf[0]
image = page.render(scale=2.0).to_pil()
image.save(output_path)
print(f"Rendered {output_path} at 2x resolution: {image.size}")
