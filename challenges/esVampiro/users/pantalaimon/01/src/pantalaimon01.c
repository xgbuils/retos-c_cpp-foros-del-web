// Autor: Pantalaimon

#define BASE 10

#include <stdio.h>
#include <math.h>
#include <string.h>

// retorna el numero de digitos de `num`. 
// Almacena en `digitos` la cantidad que hay de cada dígito
int obtenerDigitos (int num, int digitos []) {
    if (num > 0) {
        digitos[num % BASE]++;
        return 1 + obtenerDigitos(num / BASE, digitos);
    } else {
        return 0;
    }    
}

// comprueba si los colmillos concatenados numéricamente en la variable `colmillos`
// tienen los mismos digitos que el posible numero vampiro.
int buenosColmillos(int colmillos, int digitos[]) {
    if (colmillos > 0) {
        int d = colmillos % BASE;
        if (digitos[d] <= 0)
            return 0;
        else {
            digitos[d]--;
            buenosColmillos(colmillos / BASE, digitos);
        }
    } else {
        return 1;
    }
}


// prueba si `colmillo` y `num/colmillo` son buenos colmillos de `num`
// si no es así, prueba para el siguiente colmillo hasta `middle`
int probarColmillos(int colmillo, int middle, int max, int num, int digitos[]) {
    if (colmillo <= middle) {
        int otroColmillo = num / colmillo;
        if (num % colmillo == 0 
            && (colmillo % BASE != 0 || otroColmillo % BASE != 0)
            && (num - (colmillo + otroColmillo)) % 9 == 0
        ) {
            int dig[BASE];
            memcpy(dig, digitos, BASE * sizeof *dig);
            if (buenosColmillos(colmillo * max + otroColmillo, dig))
                return 1;
        }
        return probarColmillos(colmillo + 1, middle, max, num, digitos);
    } else {
        return 0;
    }
}

int esVampiro(int num) {
    int i;
    int n, min, max, middle;
    int digitos[BASE] = {0}; 

    n = obtenerDigitos(num, digitos);
    if (n % 2 != 0)
        return 0;
    max = pow(BASE, n / 2);
    min = num / max + 1;
    middle = sqrt(num); 
    
    //printf("%d %d\n", min, max);
    return probarColmillos(min, middle, max, num, digitos);
}