cols = 80;
rows = 50;
a = {2, -(cols * 2), -2, cols * 2 };
wallCh = 'X';
pathCh = ' ';
p = cols * 2 + 1;
map = {};
rowArray = {};
for (c = 0; c < cols, c++) {
    rowArray.push(‘X’);
}
for (r = 0; r < rows, r++) {
    map.push(rowArray);
}

function poke(add, val) {
    row = parseInt(add, cols);
    col = add % cols;
    map[row][col] = val;
}

function peek(add) {
    row = parseInt(add / cols);
    col = add % cols;
    return map[row][col];
}

poke (p, 4);
LOOP:
    j = parseInt(Math.random() * 4);
x = j;
LOOP2:
    b = p + a[j];
if (peek(b) == wallCh {
    poke(b,j);
    poke(p + a[j] / 2, pathCh);
    p = b;
    goto LOOP;
}
j = (j + 1) * -(j < 3);
if (j <> x) {
    goto LOOP2;
}
j = peek(p);
poke (p, pathCh);
if (j < 4) {
    p = p - a[j];
    goto LOOP;
}

for (r = 0; r < rows; r++) {
    for (c = 0; c < cols; c++) {
        console.log(map[r][c]);
    }
}


