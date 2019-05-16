
export type Matrix = number[][];
export type Vector = number[];


export const randomMatrix = function (rows: number, cols: number): Matrix {
    let matrix = [];
    for(let r = 0; r < rows; r++) {
        let row = [];
        for(let c = 0; c < cols; c++) {
            row.push(Math.random())
        }
        matrix.push(row);
    }
    return matrix;
}

export const matrixVectorProd = function(matrix: Matrix, vector: Vector): Vector {
    let out = [];
    for(let row of matrix) {
        let sum = 0;
        for(let col = 0; col < row.length; col++) {
            sum += row[col] * vector[col];
        }
        out.push(sum);
    }
    return out;
}

export const matrixAddition = function(matrix1: Matrix, matrix2: Matrix): Matrix {
    let out = [];
    for(let r = 0; r < matrix1.length; r++) {
        let row = [];
        for(let c = 0; c < matrix1[0].length; c++) {
            row.push(
                matrix1[r][c] + matrix2[r][c]
            );
        }
        out.push(row);
    }
    return out;
}

export const scalarMatrixProd = function(scalar: number, matrix: Matrix): Matrix {
    let out = [];
    for(let row of matrix) {
        let newRow = [];
        for(let entry of row) {
            newRow.push( scalar * entry );
        }
        out.push(newRow);
    }
    return out;
}

export const pointwiseMinus = function (vec1: Vector, vec2: Vector): Vector {
    return pointwiseApply(vec1, vec2, (a, b) => a - b );
}

export const pointwiseProduct = function (vec1: Vector, vec2: Vector): Vector {
    return pointwiseApply(vec1, vec2, (a, b) => a * b );
}

const pointwiseApply = function (vec1: Vector, vec2: Vector, func: (a: number, b: number) => number ): Vector {
    let out = [];
    for(let i = 0; i < vec1.length; i++) {
        out.push(
            func(vec1[i], vec2[i])
        );
    }
    return out;
}

export function vectorSum(vec: Vector): number {
    let sum = 0; 
    for (let entry of vec) {
        sum += entry;
    }
    return sum;
}

export const crossProduct = function (vec1: Vector, vec2: Vector): Matrix {
    let out = [];
    for(let r = 0; r < vec1.length; r++) {
        let row = [];
        for(let c = 0; c < vec2.length; c++){
            row.push(vec1[r] * vec2[c]);
        }
        out.push(row);
    }
    return out; 
}
