//My own implementation of a vector 2 data structure
export class Vector2{
    //holds an x and y coordinate to begin with
    constructor(x, y){
        this.x = x
        this.y = y
    }
    //returns the normalized form of the vector
    normalized(){
        let l = Math.sqrt((this.x * this.x) + (this.y * this.y))
        if(l > 0){
            return new Vector2(this.x / l, this.y / l)
        }else{
            return new Vector2(0, 0)
        }
    }
    //The following functions are static so they can be called on the Vector2 class itself rather than requiring an actual instance of the object
    //calculates the distance between two provided vectors and returns it
    static distance(start, target){
        let dist = Math.sqrt(Math.pow(target.x - start.x, 2) + Math.pow(target.y - start.y, 2))
        return dist
    }
    //sums two given vectors and returns it
    static add(vector1, vector2){
        return new Vector2(vector1.x + vector2.x, vector1.y + vector2.y)
    }
    //subtracts a given vector from another vector and returns it
    static subtract(vector1, vector2){
        return new Vector2(vector1.x - vector2.x, vector1.y - vector2.y)
    }
    //multiplies a given vector by a provided magnitude
    static multiply(vector, number){
        return new Vector2(vector.x * number, vector.y * number)
    }
    //divides a given vector by a provided magnitude
    static divide(vector, number){
        return new Vector2(vector.x / number, vector.y/number)
    }
    //returns the sum of a list of vectors
    static sum(vectorList){
        let total = new Vector2(0, 0)
        vectorList.forEach(vector => {
            total = Vector2.add(total, vector)
        });
        return total
    }
    //returns the interpolation between two given vector points by a provided percentage
    static lerp(currentVector, targetVector, percent){
        return new Vector2(currentVector.x + (targetVector.x - currentVector.x) * percent, currentVector.y + (targetVector.y - currentVector.y) * percent)
    }
}