# Resize and compress selected images for the web
# - Max width: 1920px (max height: 2560px)
# - JPEG quality: 80 (good balance)
# - Progressive JPEG: enabled
# - EXIF orientation: fixed
# - Backup: creates .bak next to original on first run

param(
    [int]$MaxWidth = 1920,
    [int]$MaxHeight = 2560,
    [int]$Quality = 80
)

Add-Type -AssemblyName System.Drawing

function Get-JpegEncoder {
    return [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
}

function Save-Jpeg {
    param(
        [Parameter(Mandatory)] [System.Drawing.Image]$Image,
        [Parameter(Mandatory)] [string]$Path,
        [int]$Quality = 80,
        [bool]$Progressive = $true
    )
    $encoder = Get-JpegEncoder
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters 2
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]$Quality)
    $scanMethodValue = if ($Progressive) { [System.Drawing.Imaging.EncoderValue]::ScanMethodInterlaced } else { [System.Drawing.Imaging.EncoderValue]::ScanMethodNonInterlaced }
    $encParams.Param[1] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::ScanMethod), ([long]$scanMethodValue)
    $Image.Save($Path, $encoder, $encParams)
    $encParams.Dispose()
}

function Fix-Orientation {
    param([System.Drawing.Image]$Image)
    try {
        $orientationPropId = 274
        $prop = $Image.GetPropertyItem($orientationPropId)
        $orientation = [int][BitConverter]::ToInt16($prop.Value, 0)
        switch ($orientation) {
            3 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
            6 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
            8 { $Image.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
            default { }
        }
        # Remove the EXIF orientation so it doesn't rotate again elsewhere
        $Image.RemovePropertyItem($orientationPropId)
    } catch { }
    return $Image
}

function Resize-Image {
    param(
        [Parameter(Mandatory)] [string]$Path,
        [int]$MaxWidth = 1920,
        [int]$MaxHeight = 2560,
        [int]$Quality = 80
    )

    if (-not (Test-Path $Path)) {
        Write-Warning "Missing: $Path"
        return
    }

    $fullPath = Resolve-Path $Path
    Write-Host "Processing: $fullPath" -ForegroundColor Cyan

    $img = $null
    try {
        $img = [System.Drawing.Image]::FromFile($fullPath)
    } catch {
        Write-Warning "Cannot open: $fullPath ($_ )"
        return
    }

    $originalWidth = $img.Width
    $originalHeight = $img.Height

    $img = Fix-Orientation -Image $img

    $scaleW = $MaxWidth / $originalWidth
    $scaleH = $MaxHeight / $originalHeight
    $scale = [Math]::Min($scaleW, $scaleH)
    if ($scale -gt 1) { $scale = 1 } # don't upscale

    $newWidth = [int][Math]::Round($originalWidth * $scale)
    $newHeight = [int][Math]::Round($originalHeight * $scale)

    if ($scale -lt 1) {
        $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        $bmp.SetResolution($img.HorizontalResolution, $img.VerticalResolution)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.DrawImage($img, 0, 0, $newWidth, $newHeight)
        $g.Dispose()
        $img.Dispose()
        $outImg = $bmp
    } else {
        $outImg = $img
    }

    # Backup original once
    $backup = "$fullPath.bak"
    if (-not (Test-Path $backup)) {
        Copy-Item $fullPath $backup -Force
    }

    # Save as progressive JPEG with target quality
    Save-Jpeg -Image $outImg -Path $fullPath -Quality $Quality -Progressive $true

    $outImg.Dispose()

    $newInfo = Get-Item $fullPath
    $oldInfo = Get-Item $backup
    $change = if ($oldInfo.Length -gt 0) { ($newInfo.Length - $oldInfo.Length) / $oldInfo.Length } else { 0 }
    Write-Host ("Original: {0:N0} bytes -> New: {1:N0} bytes; Change: {2:P0}" -f $oldInfo.Length, $newInfo.Length, $change) -ForegroundColor Green
}

# Target files (the four large preloaded images)
$targets = @(
    'assets\images\Why Choose Us -min.jpg',
    'assets\images\IMG_3795.JPG',
    'assets\images\bg02.JPG',
    'assets\images\IMG_3730-min.JPG'
)

foreach ($file in $targets) {
    Resize-Image -Path $file -MaxWidth $MaxWidth -MaxHeight $MaxHeight -Quality $Quality
}
