$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8765
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Server running at $prefix (Ctrl+C to stop)"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".png"  = "image/png"
  ".webp" = "image/webp"
  ".svg"  = "image/svg+xml"
  ".json" = "application/json"
  ".ico"  = "image/x-icon"
  ".woff2"= "font/woff2"
  ".woff" = "font/woff"
}

while ($listener.IsListening) {
  $ctx  = $listener.GetContext()
  $req  = $ctx.Request
  $resp = $ctx.Response
  $url  = $req.Url.LocalPath
  if ($url -eq "/") { $url = "/index.html" }
  $file = Join-Path $root ($url.TrimStart("/").Replace("/", "\"))
  if (Test-Path $file -PathType Leaf) {
    $ext  = [System.IO.Path]::GetExtension($file).ToLower()
    $ct   = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $resp.ContentType   = $ct
    $resp.ContentLength64 = $bytes.Length
    $resp.StatusCode    = 200
    $resp.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $resp.StatusCode = 404
    $msg = [System.Text.Encoding]::UTF8.GetBytes("Not found: $url")
    $resp.OutputStream.Write($msg, 0, $msg.Length)
  }
  $resp.Close()
}
