// Autor: leosansan
// Fecha: 17/12/2014 13:19
// Enlace: http://www.forosdelweb.com/f96/petando-pila-problemas-retos-usando-recursividad-1113701/index4.html#post4663732

#include <iostream>
#include <sstream>

extern "C" void descompon(int a, int b, int ver);
 
int comprobar_primo( int* num, int e )
{
    if (*num%e == 0)
    {
        *num /= e;
        return 1 + comprobar_primo(num, e);
    }
    return 0;
}
std::string factor_primo(int a, int b, std::stringstream& fact)
{
    unsigned exp = comprobar_primo(&a, b);
    if (exp >= 1)
    {
        fact << b;
        if (exp > 1) fact << '^' << exp;
        if (a != 1) fact << " * ";
    }
    if (a > 1) factor_primo(a, b + 1, fact);
    return fact.str();
}
void descompon(int a, int b, int ver)
{
    std::stringstream fact;
    std::string result = factor_primo(a, 2, fact);
    if(ver)
        std::cout << a << " = " << result << std::endl;
    if(a < b)
        descompon( a + 1, b, ver);
}