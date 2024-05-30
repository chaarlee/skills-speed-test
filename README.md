# skills-speed-test

Competitors need to solve easier and harder algorithmic problems in the shortest time possible. 
For each task, they will receive multiple inputs for which they need to generate the correct outputs (solutions) using code. 
The solutions can be submitted through a web interface, which the system evaluates automatically. 
The results can be continuously tracked on the display.
The framework is language independent, the competitors can use what they want.

## Configuration files
- api/db/competitors.json
- api/db/tasks.json
- api/db/general.json

## Example secrets
- neo
- trinity
- morpheus
- smith

## Run backend
```
cd api
npm install
npm run serve
```

## Run frontend
```
cd web
npm install
npm run dev
```
