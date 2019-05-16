
export class Matrix extends Array<number[]> {
    
    readonly nrows: number;
    readonly ncols: number;

    constructor(values: number[][]) {
        super(...values);
        this.nrows = values.length;
        this.ncols = values[0].length;
        Object.setPrototypeOf(this, Object.create(Matrix.prototype));
    }

    private pointwise(other: Matrix, func: (a: number, b: number) => number): Matrix {
        if(other.nrows != this.nrows || other.ncols != this.ncols) throw new Error("different dimensions");
        let newData = [];
        for(let r = 0; r < this.nrows; r++) {
            let newRow = [];
            for(let c = 0; c < this.ncols; c++) {
                newRow.push(
                    func( this[r][c], other[r][c])
                );
            }
            newData.push(newRow);
        }
        return new Matrix(newData);
    }

    add(other: Matrix): Matrix {
        return this.pointwise(other, (a, b) => a + b);
    }

    min(other: Matrix): Matrix {
        return this.pointwise(other, (a, b) => a - b);
    }

    mult(other: Matrix): Matrix {
        return this.pointwise(other, (a, b) => a * b);
    }

    matProd(other: Matrix): Matrix {
        if(other.nrows != this.ncols) throw new Error("incompatible dimensions");
        let newData = [];
        for(let ra = 0; ra < this.nrows; ra++) {
            let newRow = [];
            for(let cb = 0; cb < other.ncols; cb++) {
                let sum = 0; 
                for(let ca = 0; ca < this.ncols; ca++) {
                    sum += this[ra][ca] * other[ca][cb];
                }
                newRow.push(sum);
            }
            newData.push(newRow);
        }
        return new Matrix(newData);
    }

    vecProd(other: Vector): Vector {
        if(other.nrows != this.ncols) throw new Error("incompatible dimensions");
        let newData = [];
        for(let r = 0; r < this.nrows; r++) {
            let sum = 0; 
            for(let c = 0; c < this.ncols; c++) {
                sum += this[r][c] * other[c];
            }
            newData.push(sum);
        }
        return new Vector(newData);   
    }

    scalarProd(scalar: number): Matrix {
        let newData = [];
        for(let r = 0; r < this.nrows; r++) {
            let newRow = [];
            for(let c = 0; c < this.ncols; c++) {
                newRow.push(this[r][c] * scalar);
            }
            newData.push(newRow);
        }
        return new Matrix(newData);
    }

}

export class Vector extends Array<number> {
    
    readonly nrows: number;

    constructor(values: number[]) {
        super(...values);
        this.nrows = values.length;
        Object.setPrototypeOf(this, Object.create(Vector.prototype));
    }

    private pointwise(other: Vector, func: (a: number, b: number) => number): Vector {
        if(other.nrows != this.nrows) throw new Error("different dimensions");
        let newData = [];
        for(let r = 0; r < this.nrows; r++) {
            newData.push(
                func( this[r], other[r])
            );
        }
        return new Vector(newData);
    }

    add(other: Vector): Vector {
        return this.pointwise(other, (a, b) => a + b);
    }

    min(other: Vector): Vector {
        return this.pointwise(other, (a, b) => a - b);
    }

    mult(other: Vector): Vector {
        return this.pointwise(other, (a, b) => a * b);
    }

    innerProd(other: Vector): number {
        if(other.nrows != this.nrows) throw new Error("different dimensions");
        let sum = 0; 
        for(let r = 0; r < this.nrows; r++) {
            sum += this[r] + other[r];
        }
        return sum;
    }

    outerProd(other: Vector): Matrix {
        let values = [];
        for(let r = 0; r < this.nrows; r++) {
            let row = [];
            for(let c = 0; c < other.nrows; c++){
                row.push(this[r] * other[c]);
            }
            values.push(row);
        }
        return new Matrix(values); 
    }

    matProd(other: Matrix): Vector {
        let thisMatrix = new Matrix([this]);
        let outMat = thisMatrix.matProd(other);
        let outVec = outMat[0];
        return new Vector(outVec);
    }

    sum(): number {
        let sum = 0;
        for(let r = 0; r < this.nrows; r++) {
            sum += this[r];
        }
        return sum;
    }
    
}




export const randomMatrix = function (rows: number, cols: number): Matrix {
    let matrix = [];
    for(let r = 0; r < rows; r++) {
        let row = [];
        for(let c = 0; c < cols; c++) {
            row.push(Math.random())
        }
        matrix.push(row);
    }
    return new Matrix(matrix);
}

