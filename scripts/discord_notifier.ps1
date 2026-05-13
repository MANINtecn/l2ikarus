param (
    [string]$Title = "Atualizacao de Codigo",
    [string]$Description = "Novo commit realizado no repositorio."
)

$WebhookUrl = "https://discord.com/api/webhooks/1493424979503616110/iKf_jIET5I8NXhCOXLjWvrnj7EzaHKNS-SEi80BC501fh5RLZKO5nfSQG00XBdfjA1Aw"

$Payload = @{
    embeds = @(
        @{
            title = $Title
            description = $Description
            color = 13936439
        }
    )
}

$Json = $Payload | ConvertTo-Json -Depth 4

# Garantir que o JSON seja enviado como UTF8
Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($Json)) -ContentType "application/json"
