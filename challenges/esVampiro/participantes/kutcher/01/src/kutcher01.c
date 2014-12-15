// Autor: kutcher
// Fecha: 04-12-2012 17:06

#include <math.h>
#include <stdio.h>

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))
 
int dec[] = { 1, 10, 100, 1000, 10000, 100000 };
int cant(int num, int t)
{
    if (!num) return t;
    t +=  1 << (num % 10) * 6;
    return cant(num / 10, t);
}
int comprobar(int min, int max, int num, int b, int t)
{
    if(min >= max) return 0;
    b = num / min;
    if (min * b == num && ((min % 10) || (b%10))
        && t == cant(min, 0) + cant(b, 0))
        return 1;
    return comprobar(min + 1, max, num, b, t);
}
int esVampiro(int num)
{
    int min, max, b = 0, nd = log10(num)+1, t = cant(num, 0);
    if (nd % 2) return 0;
    nd /= 2;
    min = MAX(dec[nd - 1], (num + dec[nd] - 2)/(dec[nd] - 1));
    max = MIN(num/min, sqrt(num));
    return comprobar(min, max, num, b, t);
}