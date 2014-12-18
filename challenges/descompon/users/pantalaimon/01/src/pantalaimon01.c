#include <iostream>
#include <map>
#include <cmath>

extern "C" void descompon(int a, int b, int ver);

void descomponNumero(int num, int root, int i, std::map< int, std::pair<int, int> >& descomposiciones ) {
    auto iterator = descomposiciones.find(num);
    if (iterator == descomposiciones.end()) {
        if (num > 1 && i <= root) {
            if (num % i == 0) {
                int n = num / i;
                descomposiciones[num] = std::make_pair(i, n);
                descomponNumero(n, (int) std::sqrt(n), 2, descomposiciones);
            } else {
                descomponNumero(num, root, i + 1, descomposiciones);
            }
        } else {
            descomposiciones[num] = std::make_pair(num, 1);
        }
    }
}

void mostrar(int num, int factor, int exponente, int ver, std::map< int, std::pair<int, int> >& descomposiciones) {
    auto pair = descomposiciones[num];
    if (num <= 1 || factor != pair.first) {
        if (ver)
            std::cout << factor;
        if (exponente > 1 && ver) {
            std::cout << "^" << exponente;
        }
        if (pair.first > 1 && ver) {
            std::cout << " * ";
        }
        exponente = 0;
    }
    if (num > 1) {
        mostrar(pair.second, pair.first, exponente + 1, ver, descomposiciones);
    }
}

void descompon(int a, int b, int ver) {
    static std::map< int, std::pair<int, int> > descomposiciones;
    if (a <= b) {
        descomponNumero(a, (int) std::sqrt(a), 2, descomposiciones);
        
        if (ver)
            std::cout << a << " = ";
        mostrar(a, descomposiciones[a].first, 0, ver, descomposiciones);
        if (ver)
            std::cout << std::endl;

        descompon(a + 1, b, ver);
    }
}