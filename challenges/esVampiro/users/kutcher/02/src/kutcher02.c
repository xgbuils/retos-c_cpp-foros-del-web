// Autor: kutcher
// Fecha: 11/12/2014 13:00
// Enlace: http://www.forosdelweb.com/f96/petando-pila-problemas-retos-usando-recursividad-1113701/index4.html#post4662265

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))
 
int dec[] = { 1, 10, 100, 1000, 10000, 100000 };
int primos[10] = {2, 3, 5, 7, 11, 13, 17, 23, 29, 31};
 
int fact(int num, int t)
{
    if (!num) return t;
    t *= primos[num % 10];
    return fact(num/10, t);
}
int comprobar(int min, int max, int num, int b, int t)
{
    if(min >= max) return 0;
 
    b = num / min;
    if (min * b == num && ((min % 10) || (b%10))
        && t == fact(min,1) * fact(b,1) )
        return 1;
 
    return comprobar(min + 1, max, num, b, t);
}
int esVampiro(int num)
{
    int min, max, b = 0, nd = log10(num)+1, t = fact(num, 1);
 
    if (nd % 2) return 0;
    nd /= 2;
    min = MAX(dec[nd - 1], (num + dec[nd] - 2)/(dec[nd] - 1));
    max = MIN(num/min, sqrt(num));
 
    return comprobar(min, max, num, b, t);
}