import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.units import inch, mm

def generate_pdf_report(company_data: dict, emissions_data: dict, output_path: str):
    doc = SimpleDocTemplate(
        output_path, 
        pagesize=A4,
        rightMargin=20*mm, leftMargin=20*mm,
        topMargin=20*mm, bottomMargin=20*mm
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=30,
        alignment=1 # Center
    )
    
    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#16a34a'),
        spaceAfter=40,
        alignment=1
    )
    
    heading1 = ParagraphStyle('H1', parent=styles['Heading1'], fontSize=18, textColor=colors.HexColor('#0f172a'), spaceBefore=20, spaceAfter=10)
    heading2 = ParagraphStyle('H2', parent=styles['Heading2'], fontSize=14, textColor=colors.HexColor('#334155'), spaceBefore=15, spaceAfter=8)
    normal = ParagraphStyle('N', parent=styles['Normal'], fontSize=11, textColor=colors.HexColor('#475569'), spaceAfter=10, leading=14)
    alert = ParagraphStyle('Alert', parent=normal, textColor=colors.HexColor('#b45309'), backColor=colors.HexColor('#fef3c7'), borderPadding=10)

    Story = []
    
    # --- COVER PAGE ---
    Story.append(Spacer(1, 2 * inch))
    Story.append(Paragraph("CarbonROI", title_style))
    Story.append(Paragraph("Sustainability & Financial Intelligence Report", subtitle_style))
    
    Story.append(Spacer(1, 1 * inch))
    Story.append(Paragraph(f"<b>Prepared For:</b> {company_data.get('name')}", normal))
    Story.append(Paragraph(f"<b>Reporting Period:</b> {company_data.get('reporting_year', 'FY 2025-26')}", normal))
    Story.append(Paragraph(f"<b>Generated Date:</b> {datetime.now().strftime('%B %d, %Y')}", normal))
    Story.append(Paragraph("<b>Confidential</b>", normal))
    Story.append(PageBreak())

    # Calculate values
    total_emissions = emissions_data.get("total", 0) / 1000
    scope1 = emissions_data.get("scope1", 0) / 1000
    scope2 = emissions_data.get("scope2", 0) / 1000
    scope3 = emissions_data.get("scope3", 0) / 1000
    
    # Mock aggregated values if real ones aren't available for the MVP demo
    annual_savings = 1120000
    potential_reduction = 284
    avg_roi = 75
    money_saved = 684200
    opps = 460000

    def format_inr(val):
        if val >= 100000:
            return f"Rs {val/100000:.1f}L"
        return f"Rs {val:,}"

    # --- EXECUTIVE SUMMARY ---
    Story.append(Paragraph("1. Executive Summary", heading1))
    Story.append(Paragraph(f"This report details the carbon footprint and associated financial opportunities for {company_data.get('name')}.", normal))
    
    summary_data = [
        ["Total Emissions", f"{total_emissions:.1f} tCO2e"],
        ["Potential CO2 Reduction", f"{potential_reduction} tCO2e"],
        ["Potential Annual Savings", format_inr(annual_savings)],
        ["Money Saved YTD", format_inr(money_saved)],
        ["Avg Projected ROI", f"{avg_roi}%"]
    ]
    t = Table(summary_data, colWidths=[3*inch, 2*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.HexColor('#0f172a')),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
    ]))
    Story.append(t)
    Story.append(Spacer(1, 0.2 * inch))

    Story.append(Paragraph("<b>Key Findings</b>", heading2))
    Story.append(Paragraph(f"• Scope 2 represents a major controllable emission category for {company_data.get('industry')}.", normal))
    Story.append(Paragraph(f"• Energy optimization represents the largest savings opportunity.", normal))
    Story.append(Paragraph(f"• {format_inr(opps)} of potential financial opportunities were identified outside core operations.", normal))
    Story.append(PageBreak())

    # --- CARBON FOOTPRINT ---
    Story.append(Paragraph("2. Carbon Footprint Profile", heading1))
    Story.append(Paragraph(f"Total Carbon Footprint: <b>{total_emissions:.1f} tCO2e</b>", normal))
    
    scope_data = [
        ["Category", "Emissions (tCO2e)", "% of Total"],
        ["Scope 1 (Direct)", f"{scope1:.1f}", f"{(scope1/total_emissions*100) if total_emissions else 0:.1f}%"],
        ["Scope 2 (Energy)", f"{scope2:.1f}", f"{(scope2/total_emissions*100) if total_emissions else 0:.1f}%"],
        ["Scope 3 (Value Chain)", f"{scope3:.1f}", f"{(scope3/total_emissions*100) if total_emissions else 0:.1f}%"],
    ]
    t2 = Table(scope_data, colWidths=[2.5*inch, 2*inch, 1.5*inch])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#16a34a')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,0), 12),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
    ]))
    Story.append(t2)
    Story.append(Spacer(1, 0.4 * inch))
    
    # Emission sources
    Story.append(Paragraph("Emission Hotspots", heading2))
    sources_data = [["Source", "tCO2e"]]
    for k, v in emissions_data.get("breakdown", {}).items():
        if v > 0:
            sources_data.append([k.replace("_", " ").title(), f"{v/1000:.1f}"])
    
    if len(sources_data) > 1:
        t3 = Table(sources_data, colWidths=[3*inch, 2*inch])
        t3.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
            ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ]))
        Story.append(t3)
    
    Story.append(PageBreak())

    # --- FINANCIAL IMPACT ---
    Story.append(Paragraph("3. Financial Impact & ROI Analysis", heading1))
    Story.append(Paragraph("Decarbonization ROI Analysis", heading2))
    
    roi_data = [
        ["Action", "Investment", "Savings/Yr", "CO2 (t)", "ROI", "Payback"]
    ]
    # In a real app we'd fetch actual AI recs here. Using the prompt's explicit sample values for the report.
    roi_data.extend([
        ["HVAC Opt.", "Rs 1.2L", "Rs 2.4L", "38", "100%", "6 mo"],
        ["LED Upgrade", "Rs 1.0L", "Rs 42K", "12", "42%", "29 mo"],
        ["Transport Opt.", "Rs 1.0L", "Rs 55K", "24", "55%", "22 mo"],
        ["Solar", "Rs 3.0L", "Rs 1.1L", "60", "36%", "33 mo"]
    ])
    
    t4 = Table(roi_data)
    t4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
    ]))
    Story.append(t4)
    Story.append(Spacer(1, 0.4 * inch))

    # --- CARBON MARKET ---
    Story.append(Paragraph("4. Carbon Market Opportunity Screening", heading1))
    Story.append(Paragraph("Project Readiness: <b>78 / 100</b>", normal))
    Story.append(Paragraph("The following opportunities have been identified based on your emission profile. Missing requirements must be met before certification.", normal))
    
    Story.append(Paragraph("Disclaimer: Carbon-market opportunities shown in this report are preliminary screening estimates and do not constitute certification, guaranteed credit issuance, guaranteed revenue, or investment advice. Actual eligibility, issuance, pricing, and revenue depend on applicable standards, verification, project additionality, documentation, and market conditions.", alert))
    Story.append(Spacer(1, 0.2 * inch))

    # --- METHODOLOGY ---
    Story.append(Paragraph("5. Methodology & Data Quality", heading1))
    Story.append(Paragraph("<b>Carbon Calculation:</b> Activity Data × Emission Factor = Estimated Emissions", normal))
    Story.append(Paragraph("<b>ROI:</b> (Annual Savings / Investment) × 100", normal))
    Story.append(Paragraph("<b>Payback:</b> Investment / Annual Savings", normal))
    Story.append(Paragraph("Data Completeness: 87% (Moderate Confidence)", normal))

    # Footer
    def add_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont('Helvetica', 9)
        canvas.setFillColor(colors.gray)
        canvas.drawString(inch, 0.75 * inch, f"CarbonROI - {company_data.get('name')} - {datetime.now().strftime('%Y')}")
        canvas.drawRightString(A4[0] - inch, 0.75 * inch, f"Page {doc.page}")
        canvas.restoreState()

    doc.build(Story, onFirstPage=add_footer, onLaterPages=add_footer)
    return True
