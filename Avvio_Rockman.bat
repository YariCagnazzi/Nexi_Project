@echo off

:loop
node "C:\Users\ycagnazzi\Desktop\richieste_query\Nexi_Project\main.js"
set /p "choice=Sei sicuro di voler uscire? (y/n): "

if /i "%choice%"=="y" (
    goto :exit
) else if /i "%choice%"=="n" (
    goto :loop
) else (
    echo Scelta non valida. Per favore, inserisci "y" per uscire o "n" per continuare.
    goto :loop
)

:exit
echo Uscita confermata. Arrivederci!
pause