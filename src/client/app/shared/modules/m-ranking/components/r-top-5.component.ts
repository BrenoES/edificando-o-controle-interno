/** <pre>
 * r-top-5.component
 * =================
 * (created by luiz on Qui, jun, 01, 2017)
 *
 * Lista os 5 primeiros concorrentes, em ordem de nota da dimensao passada como parâmetro.
 *
 *  Recebe as seguintes propriedades:
 *  dimensao:          O nome do campo de 'IRankings', contendo as notas, que deve ser usado para a classificação.
 *                     Caso seja omitida, o valor 'RankingConfig.DIMENSAO_PRINCIPAL' será usado.
 *
 * Exemplo de uso:
 * *
 *  <r-top-5 dimensao="geral"></r-top-5>
 *
 * @see RelatedClass(es)
 * @author luiz
 */

// libs
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Config, LogService, ConsoleService, ILang } from '../../../../modules/core/index';
import { Input } from '@angular/core';

// config
import { ICustomRankingData,
         NOME_DO_CAMPO_DO_CONCORRENTE,
         DIMENSAO_PRINCIPAL               } from '../RankingConfig';

// services
import { RankingsService } from '../services/rankings.service';

// business logic
import { RegrasDeApresentacao } from '../RegrasDeApresentacao';


@Component({
  moduleId:    module.id,
  selector:    'r-top-5',
  templateUrl: 'r-top-5.component.html',
  styleUrls:  ['r-top-5.component.css']
})
export class RTop5Component {

  // parâmetros do componente
  @Input() dimensao:  string = DIMENSAO_PRINCIPAL;

  // estruturas de dados
  public top5Concorrentes: string[] = ['§vazio§', '§vazio§', '§vazio§', '§vazio§', '§vazio§'];
  public top5Notas:        number[] = [-1, -1, -1, -1, -1];

  public errorMessage: string = null;

  // constroi a estrutura 'top5Cidades'
  constructor(private rankingsService: RankingsService,
              private regras: RegrasDeApresentacao,
              private console: ConsoleService) {
    rankingsService.fetchRankings().subscribe(response => {
      let rankings: ICustomRankingData[] = response.sort( (e1, e2) => e2[this.dimensao] - e1[this.dimensao]);
      for (let i = 0; i < this.top5Concorrentes.length; i++) {
        this.top5Concorrentes[i] = rankings[i][NOME_DO_CAMPO_DO_CONCORRENTE];
        this.top5Notas[i]        = rankings[i][this.dimensao];
      }
    }, error => {
      this.errorMessage = <any>error;
      console.log(`r-top-5: erro carregando ranking: '${error}'`);
    });
  }

}
