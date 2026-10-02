# Documents

Award citations linked from the resume timeline's milestone cards.

| File | What |
| --- | --- |
| `wright-afam-2016.pdf` | Air Force Achievement Medal citation, 31 Mar 2016 |
| `wright-afcm-2020.pdf` | Air Force Commendation Medal citation, 20 Feb 2020 |

Both are Noah's own certificates with one change: the footer line was
**redacted**. It held the signing officials' DoD ID numbers (from their
digital-signature names) and the special-order / PAS numbers, which are other
people's identifiers and have no place on a public site.

The redaction was done with PyMuPDF's redaction annotations, which delete the
text and vector shapes underneath and paint the box black. It is not a black
rectangle drawn on top. Document metadata was cleared and the files were
rebuilt so no unreferenced copies of the old content remain. After redaction,
neither file contains the IDs anywhere, including in decompressed streams.

If either certificate is ever replaced, redact the footer the same way before
committing it.
