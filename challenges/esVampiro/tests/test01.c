#include "../prototipo.h"
#include <stdio.h>
void test01() {
    int i, n = 0;
    for (i = 100000; i < 1000000; ++i) {
        if (esVampiro(i))
        	++n;
    }
    printf("%d", n);
}