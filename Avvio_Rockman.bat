@echo off

:loop
node "C:\Users\ycagnazzi\Desktop\richieste_query\Nexi_Project\rockman.js"
set /p "choice=Vuoi uscire? (y/n): "

if /i "%choice%"=="y" (
    call :conferma_uscita
    if errorlevel 1 (
        goto :loop
    )
    goto :exit
) else if /i "%choice%"=="n" (
    goto :loop
) else (
    echo Scelta non valida. Per favore, inserisci "y" per uscire o "n" per continuare.
    goto :loop
)

:conferma_uscita
set /p "choice=Sei sicuro di voler uscire? (y/n): "
if /i "%choice%"=="n" (
    exit /b 1
)
exit /b 0

:exit
echo Uscita confermata. Arrivederci!
pause 