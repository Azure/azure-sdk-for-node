param($sourceName)

$packages = & ..\.nuget\nuget list -source $sourceName -prerelease
$packages = $packages[1 .. ($packages.length - 1)]
$packageVersions = @{}

$packages | % { $packageVersions.add($_.split(' ')[0], $_.split(' ')[1]) }

$packageConfig = [xml](gc ..\packages.config)

$packageConfig.packages.package | % { $_.version = $packageVersions[$_.id] }

$sw=New-Object system.io.stringwriter
$writer=New-Object system.xml.xmltextwriter($sw)
$writer.Formatting = [System.xml.formatting]::Indented
$packageConfig.WriteContentTo($writer)

set-content -path ..\packages.config -value $sw.ToString() -encoding UTF8

